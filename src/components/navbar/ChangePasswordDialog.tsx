import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField } from '@mui/material';
import { changePassword } from '../../services/user-service';
import { toastError } from '../../utils/notifications-utils';

interface IProps {
    open: boolean;
    onClose: () => void;
}


export const ChangePasswordDialog: React.FC<IProps> = ({ open, onClose }) => {

    const handlePasswordChange = async (newPassword: string, oldPassword: string) => {
        try {
            const userDetails = JSON.parse(localStorage.getItem('userDetails') || '')
            await changePassword(userDetails.id, newPassword, oldPassword)
        } catch (error: any) {
            if (error.response.status === 400) {
                toastError("Mật khẩu bạn nhập không đúng")
            } else {
                toastError(error.response.data)
            }

        }

    }

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            repeatPassword: '',
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required('Mật khẩu không được bỏ trống'),
            newPassword: Yup.string().required('Mật khẩu không được bỏ trống'),
            repeatPassword: Yup.string()
                .oneOf([Yup.ref('newPassword'), ''], 'Phải trùng khớp với mật khẩu mới')
                .required('Mật khẩu không được bỏ trống'),
        }),
        onSubmit: (values) => {
            handlePasswordChange(values.newPassword, values.oldPassword);
            onClose();
        },
    });



    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Đổi Mật Khẩu</DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit}>
                    <TextField
                        margin="dense"
                        id="oldPassword"
                        name="oldPassword"
                        label="Mật khẩu cũ"
                        type="password"
                        fullWidth
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                        helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                    />
                    <TextField
                        margin="dense"
                        id="newPassword"
                        name="newPassword"
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                        helperText={formik.touched.newPassword && formik.errors.newPassword}
                    />
                    <TextField
                        margin="dense"
                        id="repeatPassword"
                        name="repeatPassword"
                        label="Nhập lại mật khẩu mới"
                        type="password"
                        fullWidth
                        value={formik.values.repeatPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.repeatPassword && Boolean(formik.errors.repeatPassword)}
                        helperText={formik.touched.repeatPassword && formik.errors.repeatPassword}
                    />
                    <DialogActions>
                        <Button onClick={onClose} color="error" variant='contained'>
                            Hủy
                        </Button>
                        <Button type="submit" color="primary" variant='contained'>
                            Đổi mật khẩu
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};