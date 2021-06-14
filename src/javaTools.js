const vscode = require('vscode');
// Others
const fse = require('fs-extra');
const fs=require('fs');
const readline = require('readline');
const { promisify } = require('util');

const copyAndReplace = async (/** @type {fs.PathLike} */ src,/** @type {fs.PathLike} */ target,toReplace={})=>{
    
    const inStream = fs.createReadStream(src);
    const outStream = fs.createWriteStream(target);
    try{
        const readLine = readline.createInterface({
            input: inStream,
            crlfDelay: Infinity
        });
    
        for await (const line of readLine) {
            let toWrite=line;
            for (const key in toReplace){
                toWrite=toWrite.replace(key,toReplace[key]);
            }
            outStream.write(toWrite);
            outStream.write("\n");
        }
    }finally{
        inStream.close();
        outStream.close();
    }
}

const copyDirAndReplace = async (/** @type {fs.PathLike} */ src,/** @type {fs.PathLike} */ target,toReplace={})=>{
    const dir=fs.readdirSync(src);
    for(const i in dir){
        const file=dir[i];
        if(fs.lstatSync(src+"/"+file).isDirectory()){
            fse.ensureDirSync(target+"/"+file);
            await copyDirAndReplace(src+"/"+file,target+"/"+file,toReplace);
        }else{
            await copyAndReplace(src+"/"+file,target+"/"+file,toReplace);
        }
    }
}


const jdaCreateTemplateBot = (/** @type {string} */ groupId, /** @type {string} */ artifactId, /** @type {Boolean} */ autoBuild) => {

    const currentFolderPath = vscode.workspace.workspaceFolders[0].uri["fsPath"];

    const packageName=groupId+"."+artifactId.replace(/-/g,"_");

    const jdaTemplateFolder = vscode.extensions.getExtension("Darkempire78.discord-tools").extensionPath  + "/src/jdaTemplate";
    
    const pomPromise=copyAndReplace(jdaTemplateFolder+"/pom.xml",currentFolderPath+"/pom.xml",{"com.example":groupId,"artifact-id":artifactId});

    const targetPackageDir=currentFolderPath+"/src/main/java/"+(groupId.replace(/\./g,"/")+"/"+artifactId).toLowerCase();

    fse.ensureDirSync(targetPackageDir);

    const sourcePromise = copyDirAndReplace(jdaTemplateFolder+"/src/main/java/com/example/artifact_id",targetPackageDir,{"com.example.artifact_id":packageName});
    
    const gitignorePromise = promisify(fs.copyFile)(jdaTemplateFolder+"/.gitignore",currentFolderPath+"/.gitignore");

    const configPromise = promisify(fs.copyFile)(jdaTemplateFolder+"/config.template.json",currentFolderPath+"/config.json");
    
    Promise.all([sourcePromise, pomPromise, gitignorePromise, configPromise]).then(()=>{
        if(autoBuild){
            const terminal=vscode.window.createTerminal({ "hideFromUser": false, "name": "Create project"});
            terminal.show();
            terminal.sendText("mvn dependency:go-offline install");
        }
        vscode.window.showInformationMessage("Created bot template!");
    }).catch(error=>{
        vscode.window.showErrorMessage("Cannot create bot remplate "+error.message);
        console.error(error);
    });
}

// Exports
exports.jdaCreateTemplateBot = jdaCreateTemplateBot;