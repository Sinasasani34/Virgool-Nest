export enum BadRequestMessage {
    InValidLoginData = "اطلاعات ارسال شده برای ورود صحیح نمیباشد",
    InValidRegisterData = "اطلاعات ارسال شده برای ثبت نام صحیح نمیباشد",
}
export enum AuthMessage {
    NotFoundAccount = "حساب کاربری یافت نشد",
    TryAgain = "دوباره تلاش کنید",
    AlreadyExistAccount = "حساب کاربری در سامانه موجود است",
    ExpiredCode = "کد تایید منقضی شده است مجددا تلاش کنید",
    LoginAgain = "مجددا وارد حساب کاربری خود شوید",
    LoginIsRequired = "وارد حساب کاربری خود شوید",

}
export enum NotFoundMessage {
    NotFound = "موردی یافت نشد",
    NotFoundCategory = "دسته بندی یافت نشد",
    NotFoundPost = "مقاله ای یافت نشد",
    NotFoundUser = "کاربر مورد نظر یافت نشد",
}
export enum ValidationMessage {
    InvalidImageFormat = "فرمت تصویر آپلود شده نادرست مباشد(PNG, JPG, JPEG)"
}

export enum ConflictMessage {
    CategoryTitle = "عنوان دسته بندی قبلا ثبت شده است",
}