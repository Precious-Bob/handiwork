const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError('No document found with that id!', 404));
    return res.status(200).json({
      status: 'Success',
      data: null,
    });
  });
