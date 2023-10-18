import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { services } from '../api';

export const responseHandler: ErrorRequestHandler = (err, req: Request, res: Response, _next: NextFunction) => {
	console.log('\n');
	services.logger.error(`\x1b[31m---------------> \x1b[35m${req.method}: ${req.url}`);
	services.logger.error(`\x1b[38;5;208m${err.status}: ${err.error}`);
	services.logger.error(``, {
		stack: `\x1b[31mError: \x1b[33m${err.stack}.`,
		metadata: { method: req.method, url: req.url }
	});
	services.logger.error('\x1b[31m-------------------------------------------------------------------------------------->\x1b[0m');

	if (err instanceof ApiResponse) {
		res.status(err.status).send({ status: err.status, error: err.error, message: err.message });
	} else {
		res.status(500).send({ status: 500, error: 'Internal Server Error', message: 'Something went wrong. Please try again later.' });
	}
};

export class ApiResponse extends Error {
	status: number;
	error: string;
	message: string;
	constructor(status: number, error: string, message: string, ErrorMessage?: string) {
		super();
		this.status = status;
		this.error = error;
		this.message = ErrorMessage ?? message;
	}
}

export function validationError(joiError: Joi.ValidationError): ApiResponse {
	const errorMessages: string[] = joiError.details.map((detail) => detail.message);
	const formattedErrorMessages = errorMessages.join(', ');

	const { status, error, message } = HttpResponse.BadRequest;
	return new ApiResponse(status, error, message, formattedErrorMessages);
}

export function customError(error: ApiResponse, ErrorMessage: string): ApiResponse {
	return new ApiResponse(error.status, error.error, error.message, ErrorMessage);
}

export const HttpResponse = {
	Continue: new ApiResponse(100, 'Continue', 'The server has received the request headers and the client should proceed to send the request body.'),
	SwitchingProtocols: new ApiResponse(101, 'Switching Protocols', 'The requester has asked the server to switch protocols and the server has agreed to do so.'),
	Processing: new ApiResponse(102, 'Processing', 'The server is processing the request, but no response is available yet.'),
	EarlyHints: new ApiResponse(103, 'Early Hints', 'Used to return some response headers before final HTTP message.'),
	Ok: new ApiResponse(200, 'OK', 'The request has succeeded.'),
	Created: new ApiResponse(201, 'Created', 'The request has succeeded and a new resource has been created as a result.'),
	Accepted: new ApiResponse(202, 'Accepted', 'The request has been received but not yet acted upon.'),
	NonpatientitativeInformation: new ApiResponse(203, 'Non-patientitative Information', 'The request has succeeded but the returned meta-information in the response is from the origin server, not the original client.'),
	NoContent: new ApiResponse(204, 'No Content', 'The request has succeeded but returns no message body.'),
	ResetContent: new ApiResponse(205, 'Reset Content', 'The request has succeeded but returns no message body and requires the requester to reset the document view.'),
	PartialContent: new ApiResponse(206, 'Partial Content', 'The server is delivering only part of the resource due to a range header sent by the client.'),
	MultiStatus: new ApiResponse(207, 'Multi-Status', 'The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.'),
	already_reported: new ApiResponse(208, 'Already Reported', 'The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.'),
	ImUsed: new ApiResponse(226, 'IM Used', 'The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.'),
	MultipleChoices: new ApiResponse(300, 'Multiple Choices', 'A link list. The user can select a link and go to that location. Maximum five addresses.'),
	MovedPermanently: new ApiResponse(301, 'Moved Permanently', 'The requested page has moved to a new URL.'),
	Found: new ApiResponse(302, 'Found', 'The requested page has moved temporarily to a new URL.'),
	SeeOther: new ApiResponse(303, 'See Other', 'The requested page can be found under a different URL.'),
	NotModified: new ApiResponse(304, 'Not Modified', 'Indicates the requested page has not been modified since last requested.'),
	UseProxy: new ApiResponse(305, 'Use Proxy', 'The requested resource is only available through a proxy which should be specified in the location field.'),
	TemporaryRedirect: new ApiResponse(307, 'Temporary Redirect', 'The requested page has moved temporarily to a new URL.'),
	PermanentRedirect: new ApiResponse(308, 'Permanent Redirect', 'The requested page has moved temporarily to a new URL.'),
	BadRequest: new ApiResponse(400, 'Bad Request', 'The request cannot be fulfilled due to bad syntax.'),
	Unpatientized: new ApiResponse(401, 'Unpatientized', 'The request was a legal request, but the server is refusing to respond to it. For use when authentication is possible but has failed or not yet been provided.'),
	PaymentRequired: new ApiResponse(402, 'Payment Required', 'Reserved for future use.'),
	Forbidden: new ApiResponse(403, 'Forbidden', 'The request was a legal request, but the server is refusing to respond to it.'),
	NotFound: new ApiResponse(404, 'Not Found', 'The requested page could not be found but may be available again in the future.'),
	MethodNotAllowed: new ApiResponse(405, 'Method Not Allowed', 'A request was made of a page using a request method not supported by that page.'),
	NotAcceptable: new ApiResponse(406, 'Not Acceptable', 'The server can only generate a response that is not accepted by the client.'),
	ProxyAuthenticationRequired: new ApiResponse(407, 'Proxy Authentication Required', 'The client must first authenticate itself with the proxy.'),
	RequestTimeout: new ApiResponse(408, 'Request Timeout', 'The server timed out waiting for the request.'),
	Conflict: new ApiResponse(409, 'Conflict', 'The request could not be completed because of a conflict in the request.'),
	Gone: new ApiResponse(410, 'Gone', 'The requested page is no longer available.'),
	LengthRequired: new ApiResponse(411, 'Length Required', 'The "Content-Length" is not defined. The server will not accept the request without it.'),
	PreconditionFailed: new ApiResponse(412, 'Precondition Failed', 'The precondition given in the request evaluated to false by the server.'),
	PayloadTooLarge: new ApiResponse(413, 'Payload Too Large', 'The server will not accept the request, because the request entity is too large.'),
	UriTooLong: new ApiResponse(414, 'URI Too Long', 'The server will not accept the request, because the URL is too long. Occurs when you convert a "post" request to a "get" request with a long query information.'),
	UnsupportedMediaType: new ApiResponse(415, 'Unsupported Media Type', 'The server will not accept the request, because the media type is not supported.'),
	RangeNotSatisfiable: new ApiResponse(416, 'Range Not Satisfiable', 'The client has asked for a portion of the file, but the server cannot supply that portion.'),
	ExpectationFailed: new ApiResponse(417, 'Expectation Failed', 'The server cannot meet the requirements of the Expect request-header field.'),
	ImATeapot: new ApiResponse(418, "I'm a teapot", "I'm a teapot."),
	MisdirectedRequest: new ApiResponse(421, 'Misdirected Request', 'The request was directed at a server that is not able to produce a response.'),
	UnprocessableEntity: new ApiResponse(422, 'Unprocessable Entity', 'The request was well-formed but was unable to be followed due to semantic errors.'),
	Locked: new ApiResponse(423, 'Locked', 'The resource that is being accessed is locked.'),
	FailedDependency: new ApiResponse(424, 'Failed Dependency', 'The request failed due to failure of a previous request.'),
	UpgradeRequired: new ApiResponse(426, 'Upgrade Required', 'The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.'),
	PreconditionRequired: new ApiResponse(428, 'Precondition Required', 'The origin server requires the request to be conditional.'),
	TooManyRequests: new ApiResponse(429, 'Too Many Requests', 'The user has sent too many requests in a given amount of time ("rate limiting").'),
	RequestHeaderFieldsTooLarge: new ApiResponse(431, 'Request Header Fields Too Large', 'The server is unwilling to process the request because its header fields are too large.'),
	UnavailableForLegalReasons: new ApiResponse(451, 'Unavailable For Legal Reasons', 'The server is denying access to the resource as a consequence of a legal demand.'),
	InternalServerError: new ApiResponse(500, 'Internal Server Error', 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.'),
	NotImplemented: new ApiResponse(501, 'Not Implemented', 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.'),
	BadGateway: new ApiResponse(502, 'Bad Gateway', 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.'),
	ServiceUnavailable: new ApiResponse(503, 'Service Unavailable', 'The server is currently unavailable (overloaded or down).'),
	GatewayTimeout: new ApiResponse(504, 'Gateway Timeout', 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.'),
	HttpVersionNotSupported: new ApiResponse(505, 'HTTP Version Not Supported', 'The server does not support the HTTP protocol version used in the request.'),
	VariantAlsoNegotiates: new ApiResponse(506, 'Variant Also Negotiates', 'Transparent content negotiation for the request results in a circular reference.'),
	InsufficientStorage: new ApiResponse(507, 'Insufficient Storage', 'The server is unable to store the representation needed to complete the request.'),
	LoopDetected: new ApiResponse(508, 'Loop Detected', 'The server detected an infinite loop while processing the request.'),
	BandwidthLimitExceeded: new ApiResponse(509, 'Bandwidth Limit Exceeded', 'The server has exceeded the bandwidth specified by the server administrator.'),
	NotExtended: new ApiResponse(510, 'Not Extended', 'Further extensions to the request are required for the server to fulfill it.'),
	NetworkAuthenticationRequired: new ApiResponse(511, 'Network Authentication Required', 'The client needs to authenticate to gain network access.'),
	NetworkConnectionTimeout: new ApiResponse(599, 'Network Connect Timeout Error', 'This status code is not specified in any RFCs, but is used by Cloudflare\'s reverse proxies to signal an "unknown connection issue between Cloudflare and the origin web server" to a client in front of the proxy.')
};
