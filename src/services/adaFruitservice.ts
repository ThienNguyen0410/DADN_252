class AdafruitService {
  private static instance: AdafruitService;

  private constructor() {}

  public static getInstance(): AdafruitService {
    if (!AdafruitService.instance) {
      AdafruitService.instance = new AdafruitService();
    }
    return AdafruitService.instance;
  }

  async getHumidity() {
    // const username = "YOUR_USERNAME";
    // const feed = "humidity";
    //const key = "YOUR_AIO_KEY";

    const url = `https://io.adafruit.com/api/v2/KenElem/feeds/humidity/data`;

    const res = await fetch(url);
    const data = await res.json();
    return data;
  }

  async getTemperature() {
    const url = `https://io.adafruit.com/api/v2/KenElem/feeds/temparature/data`;

    const res = await fetch(url);
    const data = await res.json();
    return data;
  }
}

export default AdafruitService;