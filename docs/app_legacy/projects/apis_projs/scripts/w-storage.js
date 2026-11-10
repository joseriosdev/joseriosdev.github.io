class Storing {
  constructor() {
    this.city;
    this.defaultCity = "cartagena";
  }

  setLocationData(city) {
    localStorage.setItem("city", city);
  }

  getLocationData() {
    if(localStorage.getItem("city") === null)
      this.city = this.defaultCity;
    else
      this.city = localStorage.getItem("city");

    return this.city;
  }
}