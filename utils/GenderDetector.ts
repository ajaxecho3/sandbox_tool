export default async function detectGender(name: string) {
  const response = await fetch(`https://api.genderize.io/?name=${name}`);
  const data = await response.json();

  if (data.gender) {
    return data.gender; // "male", "female", or null
  } else {
    return null;
  }
}
