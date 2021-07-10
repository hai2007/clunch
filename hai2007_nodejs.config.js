const fs = require('fs');
const path = require('path');

module.exports = {

    // 当前配置文件的相对路径上下文
    path: __dirname,

    // package.json路径
    pkg: '.',

    // 定义任务
    task(hai2007_nodejs, pkg, rootPath) {

        [
            ['clunch.core.js', 'core'],
            ['clunch.core.min.js', 'core'],
            ['clunch-template.core.js', 'core@template'],
            ['clunch-template.core.min.js', 'core@template'],
            ['clunch.js'],
            ['clunch.min.js'],
            ['clunch-template.js', '@template'],
            ['clunch-template.min.js', '@template']
        ].forEach(item => {

            let filePath = path.join(rootPath, "./dist/" + item[0]);

            let banner =
                `/*!
 * clunch.js${item.length > 1 ? " <" + item[1] + "> " : " "}- ${pkg.description}
 * ${pkg.repository.url}
 *
 * author ${pkg.author} < https://hai2007.gitee.io/sweethome >
 *
 * version ${pkg.version}
 *
 * Copyright (c) 2018-2021 hai2007 走一步，再走一步。
 * Released under the ${pkg.license} license
 *
 * Date:${new Date()}
 */`;

            fs.writeFileSync(filePath, banner + "\n" + fs.readFileSync(filePath));

        });

    }

};
