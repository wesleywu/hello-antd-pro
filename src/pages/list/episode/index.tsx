import { Episode } from "./constants";
import { CrudPage } from "@/components/CrudPage";

export default () => (
  <CrudPage
    recordClass={Episode}
    pageSize={5}
    extraFooter={
      (selectedRows: Episode[]) => (
        <span>
          { '内容总量 ' }
          { selectedRows.reduce((pre, item) => pre + item.count!, 0) }
          { ' 万' }
        </span>
      )
    }
  />
);
