import React, { Fragment, SetStateAction } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Post, ReduxState, User } from '../../../redux/interfaces';
import { getIsUpdated } from '../../../util/funcs';
import PostAuthor from '../author/PostAuthor';
import DeleteModal from '../crud/DeleteModal';
import Edit from '../crud/EditPost';

interface Props {
  data: {
    me: string;
    post?: Post;
    reload: boolean;
    setReload: React.Dispatch<SetStateAction<boolean>>;
    smShow: boolean;
    setSmShow: React.Dispatch<SetStateAction<boolean>>;
  };
}

export const DropDown: React.FC<Props> = ({ data }) => {
  const { post, reload, setReload, smShow, setSmShow } = data;
  const loggedInUser = useSelector((state: ReduxState) => state.data.user);

  const updatePostProps = {
    postId: post?.id,
    reload,
    setReload,
  };

  const isUpdated = getIsUpdated(post as Post);

  return (
    <div
      className="authorinfo d-flex "
      style={{ justifyContent: 'space-between' }}
    >
      <PostAuthor
        {...{
          ...(post?.user as User),
          createdAt: isUpdated ? post?.updatedAt : post?.createdAt,
          isUpdated,
          sharedPost: post?.sharedPost,
        }}
      />
      <Dropdown className="dropdowntext ml-auto" id={post?.id}>
        <Dropdown.Toggle className="btn btn-dark dropdownbtn">
          <div className="text-muted dots">
            <b>
              <strong>•••</strong>
            </b>
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdownmenu">
          {post?.user?.id !== loggedInUser.id ? null : (
            <Fragment>
              <Edit data={updatePostProps} />
              <div className="d-flex customLinks">
                <div className="mr-3">
                  <img
                    alt=""
                    className="lrdimg"
                    width="17px"
                    src="https://img.icons8.com/fluency/50/000000/delete-sign.png"
                  />
                </div>
                <div onClick={() => setSmShow(true)} className="text-dark">
                  delete
                </div>
              </div>
              <DeleteModal
                postId={post.id}
                smShow={smShow}
                setSmShow={setSmShow}
              />
            </Fragment>
          )}
          {post?.user?.id !== loggedInUser.id && (
            <>
              <div
                className="d-flex customLinks"
                onClick={() => setSmShow(true)}
              >
                <div className="mr-3">
                  <img
                    alt=""
                    className="lrdimg"
                    width="17px"
                    src="https://img.icons8.com/fluency/50/000000/delete-sign.png"
                  />
                </div>
                <div>share</div>
              </div>
              <div className="d-flex customLinks">
                <div className="mr-3">
                  <img
                    alt=""
                    className="lrdimg"
                    width="17px"
                    src="https://img.icons8.com/fluency/50/000000/delete-sign.png"
                  />
                </div>
                <div>like</div>
              </div>
            </>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
