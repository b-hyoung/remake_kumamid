const BASE_URL = "https://firebasestorage.googleapis.com/v0/b/jvisiondesign-web.firebasestorage.app/o/";

/**
 * Firebase Storage URL을 생성하는 기본 함수
 * @param path - URL 인코딩이 필요한 전체 경로 (예: '2025/Users/디자이너이름.jpg')
 * @returns 완전한 Firebase Storage URL
 */
const getFirebaseUrl = (path: string): string => {
    return `${BASE_URL}${encodeURIComponent(path)}?alt=media`;
};

/**
 * 디자이너 프로필 이미지 URL을 가져옵니다.
 * @param year - 연도
 * @param designerName - 디자이너 이름
 * @returns 디자이너 프로필 이미지 URL
 */
export const getDesignerProfileImageUrl = (year: string, designerName: string): string => {
    if (!year || !designerName) return "";
    return getFirebaseUrl(`${year}/Users/${designerName}.jpg`);
};

/**
 * 포스터 이미지 URL을 가져옵니다.
 * @param year - 연도
 * @param designerName - 디자이너 이름
 * @param relativePath - 포스터 파일 경로 (예: 'PosterSorce/01.jpg')
 * @returns 포스터 이미지 URL
 */
export const getPosterImageUrl = (year: string, designerName: string, relativePath: string): string => {
    if (!year || !designerName || !relativePath) return "";
    return getFirebaseUrl(`${year}/UsersWorkData/${designerName}/${relativePath}`);
};

/**
 * 비디오 썸네일 URL을 가져옵니다.
 * 원본 로직은 여러 폴더를 시도하지만, 여기서는 가장 일반적인 'VideoSorce'를 우선 사용합니다.
 * FallbackImage 컴포넌트가 onError를 처리하므로, 여러 URL을 반환할 필요는 없습니다.
 * @param year - 연도
 * @param designerName - 디자이너 이름
 * @param thumbnailFile - 썸네일 파일 이름
 * @returns 비디오 썸네일 URL
 */
export const getVideoThumbnailUrl = (year: string, designerName: string, thumbnailFile: string): string => {
    if (!year || !designerName || !thumbnailFile) return "";
    return getFirebaseUrl(`${year}/UsersWorkData/${designerName}/VideoSorce/${thumbnailFile}`);
};

/**
 * 팀 프로젝트 관련 이미지 URL을 가져옵니다.
 * @param year - 연도
 * @param teamFolder - 팀 폴더 이름
 * @param fileName - 파일 이름
 * @returns 팀 프로젝트 이미지 URL
 */
export const getTeamAssetUrl = (year: string, teamFolder: string, fileName: string): string => {
    if (!year || !teamFolder || !fileName) return "";
    return getFirebaseUrl(`${year}/TeamWorkData/${teamFolder}/${fileName}`);
};
