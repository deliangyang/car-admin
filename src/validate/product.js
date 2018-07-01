const skuRuleValidate = {
    attr_value_id: [
        {required: true, message: 'sku属性不能为空', trigger: 'blur'}
    ],
    price: [
        {required: true, message: '价格不能为空', trigger: 'blur'}
    ],
    stock: [
        {required: true, message: '库存不能为空', trigger: 'blur'}
    ]
};

export default skuRuleValidate;
