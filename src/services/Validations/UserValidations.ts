import { body } from "express-validator";

export const createValidator = [
    body('user.*.name').notEmpty().withMessage('name Tidak Boleh Kosong').isString().withMessage('name Harus String'),
    body('user.*.age').notEmpty().withMessage('age Tidak Boleh Kosong').isInt({ min: 0}).withMessage('age Harus Number')
]

export const updateValidator = [
    body('name').notEmpty().withMessage('name Tidak Boleh Kosong').isString().withMessage('name Harus String'),
    body('age').notEmpty().withMessage('age Tidak Boleh Kosong').isInt({ min: 0}).withMessage('age Harus Number'),
    body('id').notEmpty().withMessage('ID Tidak Boleh Kosong').isString().withMessage('ID Harus String')
]

export const deleteValidator = [
    body('id').notEmpty().withMessage('ID Tidak Boleh Kosong').isString().withMessage('ID Harus String')
]

export const addGameValidator = [
    body('game.*.name').notEmpty().withMessage('Tidak Boleh Kosong').isString().withMessage('Harus String')
]

export const assignedValidator = [
    body('id').notEmpty().withMessage('ID Tidak Boleh Kosong').isString().withMessage('ID Harus String'),
    body('user_id').notEmpty().withMessage('User ID Tidak Boleh Kosong').isString().withMessage('User ID Harus String')
]
export const registerValidator = [
    body('username').notEmpty().withMessage('Username Tidak Boleh Kosong').isString().withMessage('Username Harus String'),
    body('password').notEmpty().withMessage('Password Tidak Boleh Kosong').isString().withMessage('Password Harus String'),
    body('name').notEmpty().withMessage('Name Tidak Boleh Kosong').isString().withMessage('Name Harus String'),
    body('age').notEmpty().withMessage('Age Tidak Boleh Kosong').isInt({ min: 0}).withMessage('Age Harus Number')

]
