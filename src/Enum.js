class EnumItem{
    constructor(name, value){
        this.name = name;
        this.value = value;
    }

    inspect(){
        return `Enum(${this.name}: ${this.value})`;
    }
};

class Enum{
    constructor(object){
        this.object = object;

        for(let key in object){
            this[key] = new EnumItem(key, object[key]);
        }
    }

    fromValue(value){
        for(let key in this.object){
            if(this[key].value === value){
                return this[key];
            }
        }
        throw new Error(`No enum for value: ${value}`);
    }
};

export {Enum, EnumItem};
