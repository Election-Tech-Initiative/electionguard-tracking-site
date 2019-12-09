using Microsoft.Extensions.Logging;

namespace ElectionGuard.BallotTracker.Functions.Logging
{
    public static class LoggingExtensions
    {
        public static ILogger CreateAzureFunctionLogger<T>(this ILoggerFactory factory) where T : class
        {
            var type = typeof(T);
            // See: https://stackoverflow.com/questions/54876798/how-can-i-use-the-new-di-to-inject-an-ilogger-into-an-azure-function-using-iwebj
            // and
            // See: https://stackoverflow.com/questions/55049683/ilogger-injected-via-constructor-for-http-trigger-functions-with-azure-function
            return factory.CreateLogger($"Function.{type.Name}.User");
        }
    }
}
