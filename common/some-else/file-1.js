// ======test======
// function parseStandFile (file) {
//   var reader = new FileReader()
//   reader.onloadend = function (event) {
//     var arrayBuffer = reader.result

//     mammoth.extractRawText({ arrayBuffer: arrayBuffer }).then(function (resultObject) {
//       $result.innerHTML = resultObject.value
//       console.log(resultObject.value)
//     })
//   }
//   reader.readAsArrayBuffer(file)
// }

// JSZip.loadAsync($file.files[0]) // 获取文件
//   .then(function (zip) {
//     let standalone
//     zip.forEach(function (relativePath, zipEntry) {
//       parsePOIFile($file.files[0]) // 解析文件内容，考虑兼容问题，单独写一个方法
//     })
//   })
// function parsePOIFile (file) {
//   JSZip.loadAsync(file)
//     .then(function (zip) {
//       var str = ''
//       zip.forEach(function (relativePath, zipEntry) {
//         if (zipEntry.name === 'word/document.xml') { // 目标文件document
//           zip.file(relativePath).async('string').then(function (data) {
//             data.match(/<w:t>[\s\S]*?<\/w:t>/ig).forEach((item) => {
//               str += item.slice(5, -6)
//             })
//             // 以上match方式参考某网友,不记得是哪个blog了
//             $result.innerHTML = str
//           })
//         }
//         // if(zipEntry.name==='docProps/core.xml'){
//         //   zip.file(relativePath).async("string").then(function (data) {
//         //      let parser=new DOMParser();
//         //      xmlDoc=parser.parseFromString(data,"text/xml");
//         //      standalone = xmlDoc.getElementsByTagName("cp:coreProperties")[0].getAttribute("xmlns:dcmitype")
//         //           if(standalone){
//         //             parseStandFile(file)   //解析标准文件
//         //           } else {
//         //             parsePOIFile(file)
//         //           }
//         //         })
//         //       }
//       })
//     }, function (e) {
//       $result.append($('<div>', {
//         'class': 'alert alert-danger',
//         text: 'Error reading ' + file.name + ': ' + e.message,
//       }))
//     })
// }
// ======test======

// const beforeUpload = useCallback((file: RcFile) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.onload = e => {
//       console.log((e.target as any).result)
//     }
//     // reader.readAsBinaryString(file)
//     // reader.readAsArrayBuffer(file)
//     // reader.readAsText(file, 'gb2312')
//     reader.readAsText(file, 'UTF-8')
//     // reader.readAsText(file, 'UTF-16')
//     // reader.readAsText(file, 'ascii')
//     resolve()
//   })
// }, [])
