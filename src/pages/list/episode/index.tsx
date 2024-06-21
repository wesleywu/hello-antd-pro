import { VideoCollection } from "./constants";
import { CrudPage } from "@/components/CrudPage";

export default () => (
  <CrudPage
    recordClass={VideoCollection}
    pageSize={5}
    extraFooter={
      (selectedRows: VideoCollection[]) => (
        <span>
          { '内容总量 ' }
          { selectedRows.reduce((pre, item) => pre + item.count!, 0) }
          { ' 万' }
        </span>
      )
    }
  />
);
