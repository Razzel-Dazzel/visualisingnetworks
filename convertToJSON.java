import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors; 

import java.util.stream.Stream;
import java.nio.file.Files;
import java.nio.file.Paths;


class convertToJSON{
    static int N = 1000; // Each line chosen from the status file
    static int linee = 0; // Starting staus index
    public static void main(String[] args) throws IOException{
        // Global data to be populated one files have been read.
        int numnodes = 0;
        ArrayList<Integer> nodes = new ArrayList<Integer>();
        ArrayList<Integer> links = new ArrayList<Integer>();
        Set<Integer> actualNodes = new HashSet<>();
        BufferedReader reader;
        
        // Try will read in all all the lines of the link file and get all the nodes as well as retain the link pairs.
		try {
            //Read in the Link files being used for RAW data
			reader = new BufferedReader(new FileReader
            ("network_to_share_100000.txt"));
            String line = reader.readLine();

            numnodes = Integer.parseInt(line);
            line = reader.readLine();
            
            while (line != null) {
                String[] values = line.split("\t");
                actualNodes.add(Integer.parseInt(values[0]));
                actualNodes.add(Integer.parseInt(values[1]));
                nodes.add(Integer.parseInt(values[0]));
                links.add(Integer.parseInt(values[1]));

                // read next line
                line = reader.readLine();
			}
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

        //////////// Getting time step data ////////////
        int statuslines = 0;
        ArrayList<ArrayList<Integer>> nodestatus = new ArrayList<>(1);
        for(int i=0; i < numnodes; i++) {
            nodestatus.add(new ArrayList<>());
        }

        String statusfile = "NodeStatus.txt";
        try (Stream<String> stream = Files.lines(Paths.get(statusfile)).skip(2).filter(s -> linee++ % N == 0)) {
            // Store all the stream data in nodestatus array
            stream.forEach(line -> {
                String[] linearray = line.split("\t");
                for (int i = 0; i < linearray.length; i++){
                    nodestatus.get(i).add(Integer.parseInt(linearray[i]));
                }
            });
		}catch (IOException e) {
			e.printStackTrace();
		}

        // Creating a new file that converts the one supplied into a JSON file.
        String filePath = ".\\JSONfiles\\";
        String fileName = "NetworkProject";
        File f = new File(filePath + fileName + ".JSON");

        if(!f.exists()){
            f.getParentFile().mkdirs(); 
            try {
                f.createNewFile();
            } catch (IOException e) {
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
                e.printStackTrace();
            }
        }
        System.out.print("File created: " + f+"\n");

        // Creata a FileWritter object
        FileWriter fw = null;
        try {
            fw = new FileWriter(f, true);
        } catch (IOException ex) {
    
        }


        boolean writingToFile = true;
        List<Integer> sortedList = new ArrayList<Integer>(actualNodes);
        Collections.sort(sortedList);

        //Function that will itterate over all the data that has been captured and create the JSON file.
        Iterator itr = actualNodes.iterator();
        if (fw != null) {
            while (writingToFile) { 
    
                try {
                    fw.write("{\n\"numNodes\": \"" + numnodes + "\",\n");


                    fw.write("\"nodes\": [\n");
                    Boolean flag = false;
                    while(itr.hasNext()) {
                        Object element = itr.next();
                        if(!flag) flag = true;
                        else fw.write(",\n");
                        // System.out.println(Integer.parseInt(element.toString()));
                        String listString = nodestatus.get(Integer.parseInt(element.toString())).stream().map(Object::toString)
                                            .collect(Collectors.joining(", "));
                        fw.write("\t{ \"name\": \"" +  element.toString() + "\", \"status\": [" + listString +"]}");
                    }
                    fw.write("\n],\n\"links\": [\n\t{ \"source\": \"" + nodes.get(0) + 
                        "\",\"target\": \"" + links.get(0) + "\"}");
                    for(int i = 1; i<nodes.size(); i++){
                        fw.write(",\n\t{ \"source\": \"" + nodes.get(i) + 
                        "\",\"target\": \"" + links.get(i) + "\"}");
                    }
                    fw.write("\n]\n}");

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