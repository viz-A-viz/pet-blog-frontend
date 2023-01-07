import { useEffect, useMemo } from 'react';

import { Button } from 'react-bootstrap';
import Post from './Post';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchPosts } from '../store/actionCreators/postsActions';
import { showAllPosts, sortPosts } from '../store/reducers/postsSlice';

export default function Posts() {
  const { posts, sortType, onlyMyPosts, showPost, page } = useAppSelector(
    (state) => state.posts
  );
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPosts()).then(() => dispatch(sortPosts()));
  }, []);

  useEffect(() => {
    dispatch(sortPosts());
  }, [sortType]);

  const displayPosts = useMemo(() => {
    const pageSize = page * 10;
    let postsOnPage = posts;
    if (user) {
      const { id } = user;
      if (onlyMyPosts) postsOnPage = posts.filter((post) => post.userId === id);
      if (showPost) return posts.filter((post) => post.id === showPost);
    }
    return postsOnPage.slice(pageSize - 10, pageSize);
  }, [posts, onlyMyPosts, showPost, page]);

  return (
    <>
      {displayPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {showPost > 0 && (
        <Button onClick={() => dispatch(showAllPosts())}>Show all posts</Button>
      )}
    </>
  );
}
