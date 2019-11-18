using System;
using System.Collections.Generic;
using System.Text;

using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

using ElectionGuard.BallotTracker.Functions.Models;
using ElectionGuard.BallotTracker.Functions.Services;
using ElectionGuard.BallotTracker.Functions.Services.AzureStorage;

[assembly: FunctionsStartup(typeof(ElectionGuard.BallotTracker.Functions.Startup))]

namespace ElectionGuard.BallotTracker.Functions
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddSingleton<IDataParser<BallotStatus>, TrackingDataParser>();
            builder.Services.AddSingleton<IDataParser<ElectionSummary>, ElectionResultsDataParser>();
            builder.Services.AddSingleton<IElectionResultsService, ElectionResultsService>();
            builder.Services.AddSingleton<IElectionResultsRepository, AzTableStorageElectionResultsRepository>();
            builder.Services.AddLogging();
            // Add all service registrations for dependency injection here
            // See: https://docs.microsoft.com/en-us/azure/azure-functions/functions-dotnet-dependency-injection
        }
    }
}
