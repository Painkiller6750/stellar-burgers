import { useEffect, FC } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '../../services/slices/feed-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.feed);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  useEffect(() => {
    handleGetFeeds();
  }, []);

  if (isLoading && !orders.length) return <Preloader />;

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
