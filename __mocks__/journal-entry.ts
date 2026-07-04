//@ts-ignore
global.JournalEntry = <any>{
    //getEmbeddedCollection
    create: async () => {return {
        createEmbeddedDocuments: async () => {}
    };}
};