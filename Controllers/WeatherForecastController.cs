using invoice_admin_web.Models;
using invoice_admin_web.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace invoice_admin_web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WeatherForecastController : ControllerBase
    {
        private readonly WeatherForecastRepository _repository;

        public WeatherForecastController()
        {
            _repository = new WeatherForecastRepository();
        }

        [HttpGet]
        public ActionResult<List<WeatherForecast>> Get() => _repository.GetAll();
    }
}
