import { accumulateRepeatedValue, reduceQueryParams } from '../../libs/http.js';
import { Raw, objectToString } from '../../libs/javascript.js';
const escapeJsString = (value) => value.replaceAll('\\', '\\\\').replaceAll('\n', '\\n').replaceAll('\r', '\\r').replaceAll("'", "\\'");
const sanitizeForGeneratedCode = (value) => {
    if (typeof value === 'string') {
        return escapeJsString(value);
    }
    if (Array.isArray(value)) {
        return value.map((item) => sanitizeForGeneratedCode(item));
    }
    if (value && typeof value === 'object' && !(value instanceof Raw)) {
        return Object.entries(value).reduce((acc, [key, objectValue]) => {
            acc[key] = sanitizeForGeneratedCode(objectValue);
            return acc;
        }, {});
    }
    return value;
};
const addHeaderValue = (headers, name, value) => {
    if (value === '') {
        headers[name] = value;
        return;
    }
    accumulateRepeatedValue(headers, name, value);
};
const buildHeaders = (request) => {
    const headers = {};
    request?.headers?.forEach((header) => {
        addHeaderValue(headers, header.name, header.value);
    });
    if (request?.cookies?.length) {
        const cookieValue = request.cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
        addHeaderValue(headers, 'Cookie', cookieValue);
    }
    return Object.keys(headers).length ? headers : undefined;
};
const buildData = (request) => {
    const setup = [];
    const postData = request?.postData;
    if (!postData) {
        return { setup };
    }
    if (postData.mimeType === 'application/json') {
        if (!postData.text) {
            return { setup };
        }
        try {
            return {
                setup,
                data: JSON.parse(postData.text),
            };
        }
        catch {
            return {
                setup,
                data: postData.text,
            };
        }
    }
    if (postData.mimeType === 'application/x-www-form-urlencoded' && postData.params?.length) {
        setup.push('const encodedParams = new URLSearchParams()');
        postData.params.forEach((param) => {
            const encodedName = escapeJsString(param.name);
            const encodedValue = escapeJsString(param.value ?? '');
            setup.push(`encodedParams.append('${encodedName}', '${encodedValue}')`);
        });
        return {
            setup,
            data: new Raw('encodedParams'),
        };
    }
    if (postData.mimeType === 'multipart/form-data' && postData.params?.length) {
        setup.push('const formData = new FormData()');
        postData.params.forEach((param) => {
            const encodedName = escapeJsString(param.name);
            if (param.fileName !== undefined) {
                const encodedFileName = escapeJsString(param.fileName);
                const blobWithType = param.contentType ? `, { type: '${escapeJsString(param.contentType)}' }` : '';
                setup.push(`formData.append('${encodedName}', new Blob([]${blobWithType}), '${encodedFileName}')`);
                return;
            }
            if (param.contentType) {
                const encodedContentType = escapeJsString(param.contentType);
                const encodedValue = escapeJsString(param.value ?? '');
                setup.push(`formData.append('${encodedName}', new Blob(['${encodedValue}'], { type: '${encodedContentType}' }))`);
                return;
            }
            const encodedValue = escapeJsString(param.value ?? '');
            setup.push(`formData.append('${encodedName}', '${encodedValue}')`);
        });
        return {
            setup,
            data: new Raw('formData'),
        };
    }
    if (!postData.text) {
        return { setup };
    }
    return {
        setup,
        data: postData.text,
    };
};
export const createAxiosPlugin = (target) => ({
    target,
    client: 'axios',
    title: 'Axios',
    generate(request, configuration) {
        const normalizedRequest = {
            method: 'GET',
            ...request,
        };
        normalizedRequest.method = normalizedRequest.method.toUpperCase();
        const options = {
            method: normalizedRequest.method,
            url: escapeJsString(normalizedRequest.url ?? ''),
        };
        const params = reduceQueryParams(normalizedRequest.queryString);
        if (Object.keys(params).length) {
            options.params = sanitizeForGeneratedCode(params);
        }
        const headers = buildHeaders(normalizedRequest);
        if (headers) {
            options.headers = sanitizeForGeneratedCode(headers);
        }
        if (configuration?.auth?.username && configuration?.auth?.password) {
            options.auth = {
                username: escapeJsString(configuration.auth.username),
                password: escapeJsString(configuration.auth.password),
            };
        }
        const { setup, data } = buildData(normalizedRequest);
        if (data !== undefined) {
            options.data = data instanceof Raw ? data : sanitizeForGeneratedCode(data);
        }
        const setupBlock = setup.length ? `${setup.join('\n')}\n\n` : '';
        return `import axios from 'axios'

${setupBlock}const options = ${objectToString(options)}

try {
  const { data } = await axios.request(options)
  console.log(data)
} catch (error) {
  console.error(error)
}`;
    },
});
