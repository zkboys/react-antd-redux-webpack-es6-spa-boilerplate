const path = require('path');
const pluralize = require('pluralize');

const name = 'building-type';
const capitalName = firstUpperCase(name);
const lowercaseName = firstLowerCase(capitalName);
const allCapitalName = allUpperCase(name);
const pluralityName = pluralize(name);

const ajaxUrl = '/v1/building';
const functionPrefix = 'BUILDING';
const chineseName = '楼栋';
const allFileDir = path.join(__dirname, `../src/pages/${name}`);
const isModal = true; // List Edit 是否是弹框模式
const modules = [ // 要生成的模块
    // 'list',
    // 'edit',
    // 'select',
    // 'checkbox',
    'service',
];

const fields = [
    {title: '楼名称', dataIndex: 'name'},
    {title: '楼编号', dataIndex: 'code'},
    {title: '排序', dataIndex: 'order'},
];

const config = {
    modules,
    name,
    capitalName,
    lowercaseName,
    allCapitalName,
    pluralityName,
    ajaxUrl,
    functionPrefix,
    chineseName,
    fields,

    listDir: allFileDir,
    listFile: 'List.jsx',
    listTemplate: path.join(__dirname, `./list-edit${isModal ? '-modal' : ''}/list.ejs`),

    editDir: allFileDir,
    editFile: 'Edit.jsx',
    editTemplate: path.join(__dirname, `./list-edit${isModal ? '-modal' : ''}/edit.ejs`),

    selectDir: allFileDir,
    selectFile: `${capitalName}Select.jsx`,
    selectTemplate: path.join(__dirname, './select-checkbox/select.ejs'),

    checkboxDir: allFileDir,
    checkboxFile: `${capitalName}CheckBox.jsx`,
    checkboxTemplate: path.join(__dirname, './select-checkbox/checkbox.ejs'),

    serviceDir: path.join(__dirname, `../src/services`),
    serviceFile: `${name}.js`,
    serviceTemplate: path.join(__dirname, './service/service.ejs'),
};

/**
 * 连字符(-) 命名 转驼峰命名
 * @param str
 */
function firstUpperCase(str) {
    const s = str.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toUpperCase() + $2);
    return s.replace(/-/g, '');
}

function firstLowerCase(str) {
    const s = str.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => $1.toLowerCase() + $2);
    return s.replace(/-/g, '');
}

/**
 * 连字符(-) 命名 转大写 + 下划线
 * @param str
 * @returns {string}
 */
function allUpperCase(str) {
    const s = str.toUpperCase();
    return s.replace(/-/g, '_');
}

module.exports = config;