import { Resource } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
    ConsoleSpanExporter,
    BatchSpanProcessor,
    SpanExporter,
    SpanProcessor,
    SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { PrismaInstrumentation } from '@prisma/instrumentation';

let traceExporter: SpanExporter;
let spanProcessor: SpanProcessor;
if (process.env.NODE_ENV === 'production') {
    traceExporter = new TraceExporter();
    spanProcessor = new BatchSpanProcessor(traceExporter);
} else {
    traceExporter = new OTLPTraceExporter({
        url: 'http://127.0.0.1:4318/v1/traces',
    });
    spanProcessor = new SimpleSpanProcessor(traceExporter);
}

const resource = Resource.default().merge(
    new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'nestjs-prisma-sample',
        [SemanticResourceAttributes.SERVICE_VERSION]: '0.0.1',
    }),
);
const sdk = new opentelemetry.NodeSDK({
    traceExporter,
    instrumentations: [
        getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-fs': {
                enabled: false,
            },
        }),
        new PrismaInstrumentation(),
    ],
    spanProcessor,
    resource,
});


// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
    sdk
        .shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((error: any) => console.log('Error terminating tracing', error))
        .finally(() => process.exit(0));
});

export default sdk;