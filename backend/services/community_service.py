from database.db import db
from models.community_post import CommunityPost
from models.post_like import PostLike
from models.post_comment import PostComment

class CommunityService:

    @staticmethod
    def create_post(content, user_id):

        post = CommunityPost(
            content=content,
            user_id=user_id
        )

        db.session.add(post)
        db.session.commit()

        return post

    @staticmethod
    def get_posts():

        return CommunityPost.query.order_by(
            CommunityPost.created_at.desc()
        ).all()

    @staticmethod
    def get_post(post_id):

        return CommunityPost.query.get(post_id)

    @staticmethod
    def like_post(post_id, user_id):
    
        post = CommunityPost.query.get(post_id)
    
        if not post:
            return None
    
        # Don't allow users to like their own post
        if post.user_id == user_id:
            return "own_post"
    
        existing_like = PostLike.query.filter_by(
            post_id=post_id,
            user_id=user_id
        ).first()
    
        if existing_like:
        
            db.session.delete(existing_like)
    
        else:
        
            like = PostLike(
                post_id=post_id,
                user_id=user_id
            )
    
            db.session.add(like)
    
        db.session.commit()
    
        return post

    @staticmethod
    def delete_post(post_id, user_id):

        post = CommunityPost.query.filter_by(
            id=post_id,
            user_id=user_id
        ).first()

        if not post:
            return None

        db.session.delete(post)
        db.session.commit()

        return post
    @staticmethod
    def add_comment(post_id, user_id, content):
    
        post = CommunityPost.query.get(post_id)
    
        if not post:
            return None
    
        comment = PostComment(
            post_id=post_id,
            user_id=user_id,
            content=content
        )
    
        db.session.add(comment)
        db.session.commit()
    
        return comment
    
    
    @staticmethod
    def get_comments(post_id):
    
        return PostComment.query.filter_by(
            post_id=post_id
        ).order_by(
            PostComment.created_at.asc()
        ).all()


    @staticmethod
    def delete_comment(comment_id, user_id):

        comment = PostComment.query.filter_by(
            id=comment_id,
            user_id=user_id
        ).first()

        if not comment:
            return None

        db.session.delete(comment)
        db.session.commit()

        return comment