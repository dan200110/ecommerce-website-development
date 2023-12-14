
const {
  listNotiByUser
} = require('../services/notification.service')

class NotificationController{
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'List Notification By User Success',
      metadata: await listNotiByUser(req.body)
    }).send(res)
  }
}

module.exports = new NotificationController()
