import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

export const tableIndex = (index: number, from: string | number) => {
    return Number(from) + index;
};

export const validateError = (data: Record<string, string | string[]>) => {
    const validate: Record<string, string | undefined> = {};
    Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
            validate[key] = data[key][0];
        } else {
            validate[key] = data[key];
        }
    });
    return validate;
};

export const promptMessage = (
    cb = () => {},
    alert: boolean = true,
    title: string = "Are you sure?",
    text: string = "Do you want to continue?",
    icon: SweetAlertIcon = "question",
    btnText: string = "Yes, Delete it"
) => {
    if (alert) {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            confirmButtonText: btnText,
            showCancelButton: true,
            focusCancel: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                cb();
            }
            return false;
        });
    } else {
        cb();
    }
};

export const alertMessage = (payload: SweetAlertOptions) => {
    Swal.fire(payload);
};

export const dateTime = (val?: string | Date | null) => {
    dayjs.extend(utc);
    dayjs.extend(timezone);
    if (val) {
        return dayjs(val).tz(process.env.VITE_PUBLIC_TIMEZONE);
    }
    return dayjs().tz(process.env.VITE_PUBLIC_TIMEZONE);
};
