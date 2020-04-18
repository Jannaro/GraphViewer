using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace GraphViewer.Controllers
{
  [ApiController]
  [Route("[controller]")]
  public class FilesController : ControllerBase      // see Test class in Test.cs
  {
    private readonly ILogger<FilesController> _logger;

    public FilesController(ILogger<FilesController> logger)
    {
      _logger = logger;
    }

    [HttpPost]
    public IEnumerable<string> Post()
    {
      IFormCollection form = Request.Form;
      IFormFileCollection files = form.Files;

      if (files.Count == 0)
      {
        return null; 
      }

      List<string> fileList = new List<string>();
      string path = Path.Combine(Path.GetTempPath(), "GraphViewerApp");
      if (!Directory.Exists(path))
        Directory.CreateDirectory(path);

      foreach (var file in files)
      {
        var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');

        var supportedTypes = new[] { "jpg", "jpeg", "png", "gif", "bmp" };
        var fileExt = Path.GetExtension(fileName).Substring(1);
        if (!supportedTypes.Contains(fileExt))
        {
          return null; // CustomJsonResult.Instance.GetError("file type error");
        }
        string filePath = Path.Combine(path, fileName);
        using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write))
        {
          file.CopyTo(fileStream);
          fileList.Add(fileName);
        }
      }

      return fileList;

      //Task<string> reqJsonTextTask;
      //using (StreamReader reader = new StreamReader(Request.Body))
      //{
      //  reqJsonTextTask = reader.ReadToEndAsync();
      //}
      //string reqJsonText = reqJsonTextTask.Result;

      //string reqJsonText;
      //using (StreamReader reader = new StreamReader(Request.Body))
      //{
      //  reqJsonText = reader.ReadToEnd();
      //}

    }
  }
}
