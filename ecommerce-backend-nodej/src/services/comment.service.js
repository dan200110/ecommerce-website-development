const Comment = require('../models/comment.model')

/*
  key features: Comment service
  + add comment [user, shop]
  + get a list of comments [user, shop]
  + delete a comment [user, shop, admin]
*/

class CommentService {
  static async createComment ({
    productId,
    userId,
    content,
    parentCommentId = null
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId
    })

    let rightValue
    if (parentCommentId) {
      // reply comment
      const parentComment = await Comment.findById(parentCommentId)
      if (!parentComment) throw new NotFoundError('record not found')

      rightValue = parentComment.comment_right
      //  updateMany comments
      await Comment.updateMany(
        {
          comment_productId: convertToObjectMongodb(productId),
          comment_right: { $gte: rightValue }
        },
        {
          $inc: { comment_right: 2 }
        }
      )

      await Comment.updateMany(
        {
          comment_productId: convertToObjectMongodb(productId),
          comment_right: { $gt: rightValue }
        },
        {
          $inc: { comment_left: 2 }
        }
      )
    } else {
      const maxRightValue = await Comment.findOne(
        {
          comment_productId: convertToObjectMongodb(productId)
        },
        'comment_right',
        { sort: { comment_right: -1 } }
      )
      if (maxRightValue) {
        rightValue = maxRightValue.right + 1
      } else {
        rightValue = 1
      }
    }
    //  insert to comment
    comment.comment_left = rightValue
    comment.comment_right = rightValue + 1

    await comment.save()
    return comment
  }

  static async getCommentsByParentId ({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId)
      if (!parent) throw new NotFoundError('record not found')

      const comments = await Comment.find({
        comment_productId: convertToObjectMongodb(productId),
        comment_parentId: convertToObjectMongodb(parentCommentId)
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1
        })
        .sort({
          comment_left: 1
        })

      return comments
    }
  }

  // delete comments
  static async deleteComments({ commentId, productId }){
    // check the product exist in the database
    const foundProduct = await findProduct({
      productId: productId
    })

    if(!foundProduct) throw new NotFoundError('product now found')
    // 1. xac dinh gia tri left vs right of commentId
    const comment = await Comment.findById(commentId)
    if(!comment) throw new NotFoundError('comment now found')

    const leftValue = comment.comment_left
    const rightValue = comment.comment_right

    // 2. tinh width
    const width = rightValue - leftValue + 1
    // 3. Xoa tat ca commentId con
    await Comment.deleteMany({
      comment_productId: convertToObjectMongodb(commentId),
      comment_left: { $gte: leftValue, $lte: rightValue }
    })
    // 4. Cap nhat gia tri left va right con lai
    await Comment.updateMany({
      comment_productId: convertToObjectMongodb(productId),
      comment_right: { $gt: rightValue }
    }, {
      $inc: { comment_right: -width }
    })

    await Comment.updateMany({
      comment_productId: convertToObjectMongodb(productId),
      comment_left: { $gt: rightValue }
    }, {
      $inc: { comment_left: -width }
    })

    return true
  }
}

module.exports = CommentService
