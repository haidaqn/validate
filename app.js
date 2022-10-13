const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// đối tượng "Validator" 

function Validator(options) {

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector))
                return element.parentElement;
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(".form-message");
        var errorMessage;
        // lấy ra các rule
        var rules = selectorRules[rule.selector];
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage)
                break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
            errorElement.innerText = "";
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage;
    }
    // lấy element của form
    // lặp qua các rule và xử lý sự kiện thay đổi ở các thẻ input ...
    var formElement = document.querySelector(options.form);
    if (formElement) {
        options.rules.forEach(function(rule) {
            formElement.onsubmit = function(e) {
                    e.preventDefault();
                    var isFormValid = true;
                    //lặp qua từng rules và validate luôn
                    options.rules.forEach(function(rule) {
                        var inputElement = formElement.querySelector(rule.selector);
                        var isValid = validate(inputElement, rule);
                        if (!isValid) {
                            isFormValid = false;
                        }
                    });
                    if (isFormValid) {
                        // truowngf hop submit voiw js 
                        if (typeof options.onSubmit === 'function') {
                            // var EnabelInput = formElement.querySelectorAll("[name]:not([disabled])");
                            var EnableInput = formElement.querySelectorAll("[name]");
                            //conver enableInput thành mảng để dùng reduce
                            var formValue = Array.from(EnableInput).reduce(function(values, input) {
                                values[input.name] = input.value
                                return values;
                            }, {});
                            options.onSubmit(formValue);
                        }
                        // submit mac dinh
                        else {
                            //hanh vi mac dinh cua trinh duyet
                            formElement.submit();
                        }
                    }
                }
                // thêm các rule vào mảng selectorRules
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            var inputElement = formElement.querySelector(rule.selector);
            if (inputElement) {
                inputElement.onblur = function() {
                    validate(inputElement, rule);
                }
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(".form-message");
                    errorElement.innerText = "";
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
            }
        });
    }
}

// định nghĩa các rules

Validator.isRequired = function(selector, mess) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : mess || "Vui lòng nhập lại trường này !";
        }
    }
}
Validator.isEmail = function(selector, mess) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : mess || "Vui Lòng nhập lại email"
        }
    }
}
Validator.minLength = function(selector, min, mess) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : mess || `Passwork phải lớn hơn  ${min} ! `;
        }
    }
}
Validator.isConfirmed = function(selector, getConfirm, mess) {

    return {
        selector,
        test: function(value) {
            return value === getConfirm() ? undefined : mess || "Giá trị nhập vào không chính xác !";
        }
    }

}