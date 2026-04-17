const db = {
  data: [],

  insert(profile) {
    this.data.push(profile);
  },

  getAll() {
    return this.data;
  },

  findById(id) {
    return this.data.find(p => p.id === id);
  },

  findByName(name) {
    return this.data.find(p => p.name === name);
  },

  delete(id) {
    const index = this.data.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    return true;
  }
};

module.exports = db;