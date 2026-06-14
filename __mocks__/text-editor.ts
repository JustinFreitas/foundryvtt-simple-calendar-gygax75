

class TE {
    changeResult: any = null;

    create () {
        return Promise.resolve({on: this.on.bind(this)});
    }

    on(a: string, b: Function){
        this.changeResult = b;
    }

    enrichHTML(){

    }
}

//@ts-ignore
global.TextEditor = new TE();
//@ts-ignore
global.foundry = global.foundry || {};
//@ts-ignore
global.foundry.applications = global.foundry.applications || {};
//@ts-ignore
global.foundry.applications.ux = global.foundry.applications.ux || {};
//@ts-ignore
global.foundry.applications.ux.TextEditor = { implementation: global.TextEditor };
