import React from "react";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

/**
 * Show toast
 * @param {string} title
 * @param {string} message 
 * @param {*} onHidden 
 * @param {string} type "error/info/warning/success"
 * @param {*} closeButton 
 * @param {*} debug 
 * @param {*} progressBar 
 * @param {*} preventDuplicates 
 * @param {*} newestOnTop 
 * @param {*} positionClass 
 * @param {*} showEasing 
 * @param {*} hideEasing 
 * @param {*} showMethod 
 * @param {*} hideMethod 
 * @param {*} showDuration 
 * @param {*} hideDuration 
 * @param {*} timeOut 
 * @param {*} extendedTimeOut 
 */
const showToast = (
    title, 
    message, 
    onHidden, 
    type = "error",
    closeButton = false,
    debug = false,
    progressBar = false,
    preventDuplicates = true,
    newestOnTop = false,
    positionClass = "toast-top-right",

    showEasing = "swing",
    hideEasing = "linear",
    showMethod = "fadeIn",
    hideMethod = "fadeOut",
    showDuration = 300,
    hideDuration = 1000,
    timeOut = 5000,
    extendedTimeOut = 1000) => {

    toastr.options = {
      positionClass: positionClass,
      timeOut: timeOut,
      extendedTimeOut: extendedTimeOut,
      closeButton: closeButton,
      debug: debug,
      progressBar: progressBar,
      preventDuplicates: preventDuplicates,
      newestOnTop: newestOnTop,
      showEasing: showEasing,
      hideEasing: hideEasing,
      showMethod: showMethod,
      hideMethod: hideMethod,
      showDuration: showDuration,
      hideDuration: hideDuration,
      onHidden: onHidden,
    };

    if (type === "info") toastr.info(message, title);
    else if (type === "warning") toastr.warning(message, title);
    else if (type === "error") toastr.error(message, title);
    else toastr.success(message, title);
  }

  const hideToast = () => toastr.clear();

  export { showToast, hideToast };
