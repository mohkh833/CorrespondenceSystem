// import { body, validationResult } from 'express-validator';
// import { Request, Response, NextFunction } from 'express';
// export const correspondenceValidationRules = () => {
// 	return [
//         // body('data.correspondence_no')
//         // .isLength({ min: 3 })
//         // .withMessage("must be at least 3 chars along")
// 	];
// };

// export const validate = (req: Request, res: Response, next: NextFunction) => {
// 	const errors = validationResult(req);
// 	if (errors.isEmpty()) {
// 		return next();
// 	}
// 	const extractedErrors: any = [];
// 	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

// 	return res.status(422).json({
// 		errors: extractedErrors
// 	});
// };

// // module.exports = {
// // 	correspondenceValidationRules,
// // 	validate
// // };
