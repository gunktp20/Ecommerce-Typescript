import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { TbShoppingBagCheck } from "react-icons/tb";
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IProps {
    isDialogOpen: boolean,
    setDialogOpen: (active: boolean) => void
}

export default function SuccessDialog(props: IProps) {

    const handleClose = () => {
        props.setDialogOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                open={props.isDialogOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContentText
                    id="confirm-delete-dashboard-dialog"
                    className="py-7 px-11"
                    component={"div"}
                    variant={"body2"}>
                    <div>
                        <TbShoppingBagCheck/>
                    </div>
                </DialogContentText>
            </Dialog>
        </React.Fragment>
    );
}