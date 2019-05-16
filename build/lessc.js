const fs = require( 'fs' )      // 引入 fs 文件读写模块
const less = require( 'less' )  // 引入 less 模块
const path = require( 'path' )  // 引入 path 路径模块


const lessPath = path.join(__dirname, '../less')
const cssPath  = path.join(__dirname, '../css')

function readAllFile(filePath){
    console.log(filePath)
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                let filedir = path.join(filePath, filename);
                console.log("dir:",filedir);

                console.log("name:",path.basename(filedir));

                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror, stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        let isFile = stats.isFile();//是文件
                        let isDir = stats.isDirectory();//是文件夹
                        if(isFile){
                            complieLess(filedir);
                        }
                        if(isDir){
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}

// readFile 第二个参数，可以指定编码类型
// 指定编码类型后，得到的数据会自动转换

function complieLess(srcPath){
    fs.readFile( srcPath, 'utf8', ( err, data ) => {
        // data.toString()
        if( err ) {
            throw err
        }
        // 这里我们读取到了 less 文件内容
        // console.log( data )
    
        let lessname = path.basename(srcPath);
        let cssname = lessname.replace("less","css");
        let distPath = path.join(cssPath,cssname);
        // 在代码中调用 less
        less.render( data, ( err, css ) => {
            if( err ) {
                throw err
            }
    
            // 在这里我们得到了 less 编译后的 css 内容
            // console.log( css.css )
            // 下面就是要将 css.css 写入到文件中
            fs.writeFile( distPath, css.css, ( err ) => {
                if ( err ) {
                    throw err
                }
                // 输出 success 编译写入成功
                console.log('success:',distPath);
            })
    
        })
    
    })
}



console.log(readAllFile(lessPath));