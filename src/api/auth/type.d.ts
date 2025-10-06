enum APIStatus {
	Successful = 0,
	Error = 1,
	SystemError = 2
}

type ResponseDTO<T = unknown> = {
	message?: string;
	status: APIStatus;
	data?: T;
};

type AddUserDTO = {
	RoleName?: string;
	UserName?: string;
	UserPassword?: string;
	UserEmail?: string;
	UserProfileFile?: File;
	UserPhNo?: string;
	GoogleTokenId?: string;
	Latitude?: number;
	Longitude?: number;
	DeviceToken?: string;
};

type LoginDTO = {
	UserEmail?: string;
	Password?: string;
};

type LoginResponseDTO = {
	token?: string;
	userName?: string;
	roleName?: string;
};

type DecodedToken = {
	userId: string;
	role: string;
	userName: string;
	exp: number;
};
