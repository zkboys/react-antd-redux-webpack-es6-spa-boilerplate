/*
 * 代码生成工具
 * cd bin
 * node init.js
 * */
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const config = require('./local-config.js');

function generateFile(template, cfg, file) {
    ejs.renderFile(template, cfg, (err, content) => {
        if (err) {
            console.error(err);
        } else {
            fs.writeFileSync(file, content);
            console.log('successfully');
        }
    });
}

function list(cfg) {
    const existsDir = fs.existsSync(cfg.listDir);
    if (!existsDir) {
        fs.mkdirSync(cfg.listDir);
    }
    const filePath = path.join(cfg.listDir, cfg.listFile);
    generateFile(cfg.listTemplate, cfg, filePath);
}

function edit(cfg) {
    const existsDir = fs.existsSync(cfg.editDir);
    if (!existsDir) {
        fs.mkdirSync(cfg.editDir);
    }
    const filePath = path.join(cfg.editDir, cfg.editFile);

    generateFile(cfg.editTemplate, cfg, filePath);
}


function checkbox(cfg) {
    const existsDir = fs.existsSync(cfg.checkboxDir);
    if (!existsDir) {
        fs.mkdirSync(cfg.checkboxDir);
    }
    const filePath = path.join(cfg.checkboxDir, cfg.checkboxFile);

    generateFile(cfg.checkboxTemplate, cfg, filePath);
}


function select(cfg) {
    const existsDir = fs.existsSync(cfg.selectDir);
    if (!existsDir) {
        fs.mkdirSync(cfg.selectDir);
    }
    const filePath = path.join(cfg.selectDir, cfg.selectFile);

    generateFile(cfg.selectTemplate, cfg, filePath);
}

function service(cfg) {
    const existsDir = fs.existsSync(cfg.serviceDir);
    if (!existsDir) {
        fs.mkdirSync(cfg.serviceDir);
    }
    const filePath = path.join(cfg.serviceDir, cfg.serviceFile);

    generateFile(cfg.serviceTemplate, cfg, filePath);
}


const modules = config.modules;

modules.forEach(item => {
    if (item === 'list') list(config);
    if (item === 'edit') edit(config);
    if (item === 'select') select(config);
    if (item === 'checkbox') checkbox(config);
    if (item === 'service') service(config);
});
