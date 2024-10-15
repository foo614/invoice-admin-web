using invoice_admin_web.Models;

namespace invoice_admin_web.Repositories
{
    public class WeatherForecastRepository
    {
        private readonly List<WeatherForecast> _forecasts;

        public WeatherForecastRepository()
        {
            _forecasts = new List<WeatherForecast>
            {
                new WeatherForecast { Date = DateTime.Now.AddDays(1), Summary = "Sunny", TemperatureC = 25 },
                new WeatherForecast { Date = DateTime.Now.AddDays(2), Summary = "Cloudy", TemperatureC = 20 },
                new WeatherForecast { Date = DateTime.Now.AddDays(3), Summary = "Rainy", TemperatureC = 15 },
                new WeatherForecast { Date = DateTime.Now.AddDays(4), Summary = "Stormy", TemperatureC = 10 },
                new WeatherForecast { Date = DateTime.Now.AddDays(5), Summary = "Windy", TemperatureC = 12 }
            };
        }

        public List<WeatherForecast> GetAll() => _forecasts;
    }
}
