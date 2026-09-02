import { requestsLikeGenerate } from '../../../plugins/python/requestsLike.js';
/**
 * python/httpx_async
 */
export const pythonHttpxAsync = {
    target: 'python',
    client: 'httpx_async',
    title: 'HTTPX (Async)',
    generate(request, configuration) {
        let formattedReq = requestsLikeGenerate('await client', request, configuration);
        // add indent
        formattedReq = formattedReq
            .split('\n')
            .map((line) => (line.trim() === '' ? line : '    ' + line))
            .join('\n');
        return `async with httpx.AsyncClient() as client:\n${formattedReq}`;
    },
};
