export default interface IPost {
  id: string;
  title: string;
  content: string;
  imagePath?: string;
  canEdit?: boolean;
}
