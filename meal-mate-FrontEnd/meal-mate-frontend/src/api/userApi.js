export async function getUser(userId) {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('사용자 정보를 불러오는 데 실패했습니다.');
  }

  return response.json();
}
