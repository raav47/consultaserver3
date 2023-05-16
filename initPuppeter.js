class PuppeteerHandler {
    constructor(conString) {
        this.conString = conString
    }
  
    static getInstance(conString) {
      if (!this.instance) {
        this.instance = new DBConnection(conString);
      }
  
      return this.instance;
    }
  }
  
  let con1 = DBConnection.getInstance('mysqldb1');