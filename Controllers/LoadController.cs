using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GraphViewer.Controllers
{
  [Route("[controller]")]
  [ApiController]
  public class LoadController : ControllerBase
  {
    // GET: Load
    [HttpGet]
    public IEnumerable<string> Get()
    {
        return new string[] { "value1", "value2" };
    }

    // GET: Load/name
    [HttpGet("{name}", Name = "Get")]
    public IActionResult Get(string name)
    {
      string path = Path.Combine(Path.GetTempPath(), "GraphViewerApp");
      path = Path.Combine(path, name);
      //var image = System.IO.File.OpenRead(path);
      //return File(image, "image/jpeg");
      return PhysicalFile(path, "image/jpeg");
    }

    // POST: api/Load
    [HttpPost]
    public void Post([FromBody] string value)
    {
    }

    // PUT: api/Load/5
    [HttpPut("{id}")]
    public void Put(int id, [FromBody] string value)
    {
    }

    // DELETE: api/ApiWithActions/5
    [HttpDelete("{id}")]
    public void Delete(int id)
    {
    }
  }
}
