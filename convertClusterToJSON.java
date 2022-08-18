import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;


class convertToJSON{

    public static void main(String[] args) throws IOException{
        ArrayList<Integer> cluster = new ArrayList<Integer>();
        ArrayList<Integer> nodes = new ArrayList<Integer>();
        //Set<String> actualNodes = new HashSet<>();
        int count = 0;
        BufferedReader reader;
        
        
		try {
			reader = new BufferedReader(new FileReader
            ("C:\\Users\\adam-\\Documents\\Programming\\GItRepo\\visualisingnetworks\\output.csv")); //THIS NEEDS TO BE PASSED IN
            String line = reader.readLine();

            while (line != null) {

                String[] values = line.split(",");
                actualNodes.add(values[0]);
                actualNodes.add(values[1]);
                nodes.add(Integer.parseInt(values[0]));
                links.add(Integer.parseInt(values[1]));
                System.out.println();
				// read next line
				line = reader.readLine();
                //System.out.println(line);

			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

        // Creating a new file that converts the one supplied into a JSON file.
        String filePath = "G:\\My Drive\\Bachelor of Engineering (Honours)\\2022\\Sem1\\EGH400-1\\Project\\JSONfiles\\";
        String fileName = "NetworkProject";
        File f = new File(filePath + fileName + ".JSON");

        if(!f.exists()){
            f.getParentFile().mkdirs(); 
            try {
                f.createNewFile();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }else{
            int i = 0;
            do{
                f = new File(filePath + fileName + "_"+ i +".JSON");
                i++;
            }while(f.exists());
            f.getParentFile().mkdirs(); 
            try {
                f.createNewFile();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        System.out.print("File created: " + f+"\n");


        FileWriter fw = null;
        try {
            fw = new FileWriter(f, true);
        } catch (IOException ex) {
    
        }



        int counter = 0;
        boolean writingToFile = true;
        Iterator itr = actualNodes.iterator();
        if (fw != null) {
            while (writingToFile) { //same as while(runTrue == true)
    
                try {

      
                    fw.write("{\n");
                    fw.write("\"nodes\": [\n");
                    while(itr.hasNext()) {
                        Object element = itr.next();
                        fw.write("\t{ \"name\": \"" +  element.toString() + "\"},\n");
                    }
                    fw.write("],\n");
                    fw.write("\"links\": [\n");
                    for(int i = 0; i<nodes.size(); i++){
                        fw.write("\t{ \"source\": \"" + nodes.get(i) + 
                        "\",\"target\": \"" + links.get(i) + "\"},\n");
                    }
                    System.out.println(actualNodes.size());
                    fw.write("]\n}");



    
                } catch (IOException e) {
                    break;
                }
                if(true){
                    fw.flush();
                    fw.close();
                    writingToFile = false;
                    break;
                }
            }
        }

    }

}