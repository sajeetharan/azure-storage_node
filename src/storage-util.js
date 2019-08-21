
const azstore = require('azure-storage');

require('dotenv').config();

const bst = azstore.createBlobService(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_ACCESS_KEY);

// const CONTAINER = 'demo';

async function createContainer(containername) {
    return new Promise(async r => {
        bst.createContainerIfNotExists(containername, () => r());
    })
}

module.exports = {
    write: async function(containername, name, text) {
        return new Promise(async (resolve, reject) => {
            await createContainer(containername);
            bst.createBlockBlobFromText(containername, name, text, (err) => {
                if (!err) resolve();
                else reject();
            })
        })
    },
    read: async function(containername, name) {
        return new Promise(async r => {
            bst.getBlobToText(containername, name, (err, text) => r(err ? null : text));
        })
    },
};

