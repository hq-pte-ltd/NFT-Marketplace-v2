import React, { useState } from 'react';
import { Order as OrderComponent } from '../OrderUSDC';
import { Order } from '@liqnft/candy-shop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { CandyShop } from '@liqnft/candy-shop-sdk';
import { Order as OrderSchema } from '@liqnft/candy-shop-types';
import { getExchangeInfo } from '../../utils/getExchangeInfo';
import { BuyModalUSDC } from '../BuyModalUSDC';
import { CancelModal } from '../CancelModal';
import { LoadingSkeleton } from '../LoadingSkeleton';

interface InfiniteOrderListProps {
  orders: Order[];
  wallet: AnchorWallet | undefined;
  walletConnectComponent: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  url?: string;
  hasNextPage: boolean;
  loadNextPage: () => void;
  candyShop: CandyShop;
  sellerUrl?: string;
}

export const InfiniteOrderListUSDC: React.FC<InfiniteOrderListProps> = ({
  orders,
  wallet,
  walletConnectComponent,
  url,
  hasNextPage,
  loadNextPage,
  candyShop,
  sellerUrl
}) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderSchema>();
  const onSelectOrder = (order?: OrderSchema) => setSelectedOrder(order);

  const exchangeInfo = getExchangeInfo(selectedOrder, candyShop);
  const isUserListing =
    selectedOrder && wallet?.publicKey && selectedOrder.walletAddress === wallet.publicKey.toString();

  return (
    <>
      <InfiniteScroll dataLength={orders.length} next={loadNextPage} hasMore={hasNextPage} loader={<LoadingSkeleton />}>
        <div className="candy-container-list">
          {orders.map((order) => (
            <div key={order.tokenMint}>
              <OrderComponent
                order={order}
                walletConnectComponent={walletConnectComponent}
                wallet={wallet}
                url={url}
                candyShop={candyShop}
                sellerUrl={sellerUrl}
                onOrderSelection={onSelectOrder}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {selectedOrder && !isUserListing ? (
        <BuyModalUSDC
          order={selectedOrder}
          onClose={() => onSelectOrder(undefined)}
          wallet={wallet}
          walletConnectComponent={walletConnectComponent}
          exchangeInfo={exchangeInfo}
          shopAddress={candyShop.candyShopAddress}
          candyShopProgramId={candyShop.programId}
          connection={candyShop.connection()}
          isEnterprise={candyShop.isEnterprise}
          shopPriceDecimalsMin={candyShop.priceDecimalsMin}
          shopPriceDecimals={candyShop.priceDecimals}
          sellerUrl={sellerUrl}
        />
      ) : null}

      {selectedOrder && isUserListing && wallet ? (
        <CancelModal
          onClose={() => onSelectOrder(undefined)}
          order={selectedOrder}
          wallet={wallet}
          exchangeInfo={exchangeInfo}
          shopAddress={candyShop.candyShopAddress}
          candyShopProgramId={candyShop.programId}
          connection={candyShop.connection()}
          candyShopVersion={candyShop.version}
          shopPriceDecimalsMin={candyShop.priceDecimalsMin}
          shopPriceDecimals={candyShop.priceDecimals}
        />
      ) : null}
    </>
  );
};
