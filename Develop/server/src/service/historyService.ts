import fs from 'node:fs/promises';


// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

    constructor (id: string, name: string) {
      this.id = id;
      this.name = name;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  private async read() {
    return await fs.readFile('db/db.json', {
      flag: 'a+', 
      encoding: 'utf-8',
    }); 
  }

  // TODO: Define a read method that reads from the searchHistory.json file

  

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
   private async write(cities: City[]): Promise<void> {
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, 2));
   }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    return await this.read().then((cities) => {
      let village: City[];
    try {
      village = [].concat(JSON.parse(cities));
    } catch (err) {
      village = [];
    } return village;
      
    });
  }

  async addCity(name: string): Promise<void> {
    const cities: City[] = JSON.parse(await this.read());
    const id = (cities.length + 1).toString();
    const newCity = new City(id, name);
    cities.push(newCity);
    await this.write(cities);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  //async removeCity(id: string):  {}
  
}

export default new HistoryService();
