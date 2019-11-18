using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

using ElectionGuard.BallotTracker.Functions.Models;

namespace ElectionGuard.BallotTracker.Functions.Services
{
    public interface IDataParser<T>
    {
        IEnumerable<T> ParseCsvData(Stream data);
    }
}
