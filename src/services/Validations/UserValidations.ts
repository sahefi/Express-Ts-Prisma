import { body } from "express-validator";

export const createValidator = [
    body('user.*.nama').notEmpty().withMessage('Nama Tidak Boleh Kosong').isString().withMessage('Nama Harus String'),
    body('user.*.umur').notEmpty().withMessage('umur Tidak Boleh Kosong').isString().withMessage('Umur Harus String')
]

export const updateValidator = [
    body('nama').notEmpty().withMessage('Nama Tidak Boleh Kosong').isString().withMessage('Nama Harus String'),
    body('umur').notEmpty().withMessage('Umur Tidak Boleh Kosong').isString().withMessage('Umur Harus String'),
    body('id').notEmpty().withMessage('ID Tidak Boleh Kosong').isString().withMessage('ID Harus String')
]

export const deleteValidator = [
    body('id').notEmpty().withMessage('ID Tidak Boleh Kosong').isString().withMessage('ID Harus String')
]